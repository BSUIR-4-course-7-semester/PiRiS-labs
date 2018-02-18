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
  home_tel_number: string;
  mobile_tel_number: string;
  email: string;
  job_place: string;
  job_position: string;
  registration_city_id: string;
  registration_address: string;
  marital_status_id: number;
  nationality_id: number;
  disability_id: number = 0;
  pensioner = false;
  monthly_revenue = 0.00;

  static createFromServerResponse(data): Client {
    const result = new Client();
    result.id = data.id;
    result.actual_address = data.actual_address;
    result.surname = data.surname;
    result.first_name = data.first_name;
    result.patronymic = data.patronymic;
    result.birth_date = data.birth_date;
    result.passport_series = data.passport_series;
    result.passport_number = data.passport_number;
    result.passport_reducer = data.passport_reducer;
    result.passport_reducing_date = data.passport_reducing_date;
    result.identification_number = data.identification_number;
    result.birth_place = data.birth_place;
    result.actual_residence_city_id = data.actual_residence_city_id;
    result.actual_address = data.actual_address;
    result.home_tel_number = data.home_tel_number;
    result.mobile_tel_number = data.mobile_tel_number;
    result.email = data.email;
    result.job_place = data.job_place;
    result.job_position = data.job_position;
    result.registration_city_id = data.registration_city_id;
    result.registration_address = data.registration_address;
    result.marital_status_id = data.marital_status_id;
    result.nationality_id = data.nationality_id;
    result.disability_id = data.disability_id;
    result.pensioner = data.pensioner;
    result.monthly_revenue = data.monthly_revenue;
    return result;
  }
}
