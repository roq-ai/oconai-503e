import * as yup from 'yup';

export const optionContractValidationSchema = yup.object().shape({
  contract_data: yup.string().required(),
  company_id: yup.string().nullable(),
});
