export class Client {
  id: number;
  surname: string;
  first_name: string;
  patronymic: string;
  birth_date: Date;
  passport_series: string;
  passport_number: string;
  passport_reducer: string;
  passport_reducing_date: Date;
  identification_number: string;
  birth_place: string;
  actual_residence_city_id: string;
  actual_address: string;
  home_tel_phone: string;
  mobile_tel_phone: string;
  email: string;
  job_place: string;
  job_position: string;
  registration_address: string;
  marital_status_id: number;
  nationality_id: number;
  disability_id: number;
  pensioner: boolean;
  monthly_revenue: number;

  static createFromServerResponse(data): Client {
    return new Client();
  }
}
