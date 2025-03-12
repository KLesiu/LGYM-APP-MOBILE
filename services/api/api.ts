/** Generate by swagger-axios-codegen */
// @ts-nocheck
/* eslint-disable */

/** Generate by swagger-axios-codegen */
/* eslint-disable */
// @ts-nocheck
import axiosStatic, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface IRequestOptions extends AxiosRequestConfig {
  /**
   * show loading status
   */
  loading?: boolean;
  /**
   * display error message
   */
  showError?: boolean;
  /**
   * indicates whether Authorization credentials are required for the request
   * @default true
   */
  withAuthorization?: boolean;
}

export interface IRequestConfig {
  method?: any;
  headers?: any;
  url?: any;
  data?: any;
  params?: any;
}

// Add options interface
export interface ServiceOptions {
  axios?: AxiosInstance;
  /** only in axios interceptor config*/
  loading: boolean;
  showError: boolean;
}

// Add default options
export const serviceOptions: ServiceOptions = {};

// Instance selector
export function axios(configs: IRequestConfig, resolve: (p: any) => void, reject: (p: any) => void): Promise<any> {
  if (serviceOptions.axios) {
    return serviceOptions.axios
      .request(configs)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  } else {
    throw new Error('please inject yourself instance like axios  ');
  }
}

export function getConfigs(method: string, contentType: string, url: string, options: any): IRequestConfig {
  const configs: IRequestConfig = {
    loading: serviceOptions.loading,
    showError: serviceOptions.showError,
    ...options,
    method,
    url
  };
  configs.headers = {
    ...options.headers,
    'Content-Type': contentType
  };
  return configs;
}

export const basePath = '';

export interface IList<T> extends Array<T> {}
export interface List<T> extends Array<T> {}
export interface IDictionary<TValue> {
  [key: string]: TValue;
}
export interface Dictionary<TValue> extends IDictionary<TValue> {}

export interface IListResult<T> {
  items?: T[];
}

export class ListResultDto<T> implements IListResult<T> {
  items?: T[];
}

export interface IPagedResult<T> extends IListResult<T> {
  totalCount?: number;
  items?: T[];
}

export class PagedResultDto<T = any> implements IPagedResult<T> {
  totalCount?: number;
  items?: T[];
}

// customer definition
// empty

export class EnumService {
  /**
   *
   */
  static get(
    params: {
      /** requestBody */
      body?: EnumQueryDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/Enum/get';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}

export class ExerciseService {
  /**
   *
   */
  static create(
    params: {
      /** requestBody */
      body?: RegisterExerciseDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/Exercise/create';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static get(
    params: {
      /** requestBody */
      body?: IdDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/Exercise/get';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static update(
    params: {
      /** requestBody */
      body?: ExerciseDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/Exercise/update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static deleted(
    params: {
      /** requestBody */
      body?: IdDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/Exercise/deleted';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getAll(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/Exercise/getAll';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}

export class GymService {
  /**
   *
   */
  static create(
    params: {
      /** requestBody */
      body?: RegisterGymDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/Gym/create';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static get(
    params: {
      /** requestBody */
      body?: IdDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/Gym/get';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static update(
    params: {
      /** requestBody */
      body?: GymDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/Gym/update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static deleted(
    params: {
      /** requestBody */
      body?: IdDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/Gym/deleted';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getAll(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/Gym/getAll';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}

export class UserService {
  /**
   *
   */
  static register(
    params: {
      /** requestBody */
      body?: RegisterUserDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/register';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static login(
    params: {
      /** requestBody */
      body?: LoginUserDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/login';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}

/** EnumQueryDto */
export class EnumQueryDto {
  /**  */
  'type'?: string;

  constructor(data: EnumQueryDto = {}) {
    Object.assign(this, data);
  }
}

/** ExerciseDto */
export class ExerciseDto {
  /**  */
  'id'?: number;

  /**  */
  'name'?: string;

  /**  */
  'isGlobal'?: boolean;

  /**  */
  'bodyPart'?: LookupItemDto;

  /**  */
  'owner'?: IdDto;

  constructor(data: ExerciseDto = {}) {
    Object.assign(this, data);
  }
}

/** GymDto */
export class GymDto {
  /**  */
  'id'?: number;

  /**  */
  'name'?: string;

  /**  */
  'owner'?: IdDto;

  constructor(data: GymDto = {}) {
    Object.assign(this, data);
  }
}

/** IdDto */
export class IdDto {
  /**  */
  'id'?: number;

  constructor(data: IdDto = {}) {
    Object.assign(this, data);
  }
}

/** LoginUserDto */
export class LoginUserDto {
  /**  */
  'login'?: string;

  /**  */
  'password'?: string;

  constructor(data: LoginUserDto = {}) {
    Object.assign(this, data);
  }
}

/** LookupItemDto */
export class LookupItemDto {
  /**  */
  'id'?: string;

  /**  */
  'name'?: string;

  constructor(data: LookupItemDto = {}) {
    Object.assign(this, data);
  }
}

/** RegisterExerciseDto */
export class RegisterExerciseDto {
  /**  */
  'name'?: string;

  /**  */
  'isGlobal'?: boolean;

  /**  */
  'bodyPart'?: LookupItemDto;

  constructor(data: RegisterExerciseDto = {}) {
    Object.assign(this, data);
  }
}

/** RegisterGymDto */
export class RegisterGymDto {
  /**  */
  'name'?: string;

  constructor(data: RegisterGymDto = {}) {
    Object.assign(this, data);
  }
}

/** RegisterUserDto */
export class RegisterUserDto {
  /**  */
  'login'?: string;

  /**  */
  'email'?: string;

  /**  */
  'password'?: string;

  constructor(data: RegisterUserDto = {}) {
    Object.assign(this, data);
  }
}
