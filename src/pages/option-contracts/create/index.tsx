import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createOptionContract } from 'apiSdk/option-contracts';
import { Error } from 'components/error';
import { optionContractValidationSchema } from 'validationSchema/option-contracts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';
import { OptionContractInterface } from 'interfaces/option-contract';

function OptionContractCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: OptionContractInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createOptionContract(values);
      resetForm();
      router.push('/option-contracts');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<OptionContractInterface>({
    initialValues: {
      contract_data: '',
      company_id: (router.query.company_id as string) ?? null,
    },
    validationSchema: optionContractValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Option Contract
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="contract_data" mb="4" isInvalid={!!formik.errors?.contract_data}>
            <FormLabel>Contract Data</FormLabel>
            <Input
              type="text"
              name="contract_data"
              value={formik.values?.contract_data}
              onChange={formik.handleChange}
            />
            {formik.errors.contract_data && <FormErrorMessage>{formik.errors?.contract_data}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<CompanyInterface>
            formik={formik}
            name={'company_id'}
            label={'Select Company'}
            placeholder={'Select Company'}
            fetcher={getCompanies}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'option_contract',
    operation: AccessOperationEnum.CREATE,
  }),
)(OptionContractCreatePage);
