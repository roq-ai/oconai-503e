import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface OptionContractInterface {
  id?: string;
  contract_data: string;
  company_id?: string;
  created_at?: any;
  updated_at?: any;

  company?: CompanyInterface;
  _count?: {};
}

export interface OptionContractGetQueryInterface extends GetQueryInterface {
  id?: string;
  contract_data?: string;
  company_id?: string;
}
