import axios, { AxiosError, AxiosResponse ,AxiosRequestConfig} from "axios";

import { GenericReponse } from "../Model/GenericResponse";
import { LoginModel } from "../Model/Login";
import { AboutType, ContactType, NewsType, PartnerType, PriceType, ProgressType, SettingsType, SliderType, YoutubeLinkType } from "../Model/types";



export const baseImageUrl = `https://honeybal.net/`;
/* interface IAuth extends AxiosRequestConfig{
  Authorization: string
} */
axios.defaults.baseURL = "https://honeybal.net/api";
axios.interceptors.request.use((config:AxiosRequestConfig) => {
  const token = localStorage.getItem('agent')
  if (token ) config.headers = {...config.headers,Authorization:'Bearer '+token};
   
/*     
    if(company) config.headers = {...config.headers,companyUUID :company};
    if(section) config.headers = {...config.headers,sectionUUID :section}; */
    return config;
  });
  


  axios.interceptors.response.use(
    async (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const { data, status, statusText }:any = error.response!;
      switch (status) {
        case 400:
          console.log(data);
          if (typeof data === "string") {
            console.log(statusText);
          }
  
          if (data.errors) {
            const modalStateErrors = [];
            for (const k in data.errors)
              if (data.errors[k]) {
                modalStateErrors.push(data.errors[k]);
              }
            throw modalStateErrors.flat();
          }
          break;
  
        case 404:
          console.log(data);
  
          break;
          case 409 :
            
            break;
        case 500:
          console.log(data);
  
          break;
      }
      return Promise.reject(error);
    }
  );
  const responseBody = <T>(response: AxiosResponse<T>) => response.data;

  const requests = {
    get: <T>(url: string,body?:{}) => axios.get<T>(url,{params:body}).then(responseBody),
    post: <T>(url: string, body: {}) =>
      axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
  };
  
  const Login = (body:{email:string, password:string})=>requests.post<LoginModel>('/login-user',body)

  const slider = {
    list:()=>requests.get<GenericReponse<SliderType[]>>('/slider'),
    add:(body:any)=>requests.post<GenericReponse<boolean>>('/slider/store',body),
    update:(body:any, link:number)=>requests.post<GenericReponse<boolean>>('/slider/update/'+link,body),
    delete:(id:number)=>requests.del<GenericReponse<true>>('delete/slider/'+id)
  }

  const progress = {
    list:()=>requests.get<GenericReponse<ProgressType[]>>('/progress'),
    add:(body:any)=>requests.post<GenericReponse<boolean>>('/progress/store',body),
    update:(body:any, link:number)=>requests.post<GenericReponse<boolean>>('/progress/update/'+link,body),
    delete:(id:number)=>requests.del<GenericReponse<true>>('delete/progress/'+id)
  }

  const about ={
    get:()=>requests.get<GenericReponse<AboutType>>('/about'),
    update:(body:any)=>requests.post<GenericReponse<true>>('/about/update/1',body)
  }
  const partner = {
    list:()=>requests.get<GenericReponse<PartnerType[]>>('/partner'),
    upload:(body:any)=>requests.post<GenericReponse<boolean>>('/partner/store',body),
    delete:(id:number)=>requests.del<GenericReponse<boolean>>('/delete/partner/'+id)
  }
  const news = {
    list:()=>requests.get<GenericReponse<NewsType[]>>('/news'),
    add:(body:any)=>requests.post<GenericReponse<boolean>>('/news/store',body),
    update:(body:any, link:number)=>requests.post<GenericReponse<boolean>>('/news/update/'+link,body),
    delete:(id:number)=>requests.del<GenericReponse<true>>('delete/news/'+id)
  }
  const newsCategory = {
    list:()=>requests.get<GenericReponse<{title_az: string,title_ru: string,title_en: string, id:number}[]>>('/news-category'),
    add:(body:{title:string})=>requests.post<GenericReponse<boolean>>('/news-category/store',body),
    delete:(id:number)=>requests.del<GenericReponse<true>>('delete/news-category/'+id)
  }
  const service = {
    list:()=>requests.get<GenericReponse<(NewsType&{icon:string})[]>>('/service'),
    add:(body:any)=>requests.post<GenericReponse<boolean>>('/service/store',body),
    update:(body:any, link:number)=>requests.post<GenericReponse<boolean>>('/service/update/'+link,body),
    delete:(id:number)=>requests.del<GenericReponse<true>>('delete/service/'+id)
  }
  const serviceCategory = {
    list:()=>requests.get<GenericReponse<{title:string, id:number}[]>>('/service-category'),
    add:(body:{title:string})=>requests.post<GenericReponse<boolean>>('/service-category/store',body),
    delete:(id:number)=>requests.del<GenericReponse<true>>('delete/service-category/'+id)
  }
  const setting = {
    get:()=>requests.get<GenericReponse<SettingsType[]>>('/setting'),
    update:(body:SettingsType)=>requests.post<GenericReponse<SettingsType>>('/setting/update/1', body)
  }
  const contact = {
    get:()=>requests.get<GenericReponse<ContactType>>('/contact'),
    update:(body:SettingsType)=>requests.post<GenericReponse<ContactType>>('/contact/update/1', body)
  }
  const cover ={
    get:(title:string)=>requests.get<GenericReponse< {title:string,image:string}>>('/cover',{title}),
    update:(body:FormData)=>requests.post<GenericReponse<{title:string,image:string}>>('/cover/update',body)
  }

  const youtubeLink = {
    get:()=>requests.get<GenericReponse<YoutubeLinkType>>('/youtube-link'),
    edit:(body:any)=>requests.post<GenericReponse<boolean>>('/youtube-link/update/',body),
  
  }

  const price = {
    list:()=>requests.get<GenericReponse<PriceType[]>>('/price'),
    add:(body:any)=>requests.post<GenericReponse<boolean>>('/price/store',body),
    update:(body:any,link:number)=>requests.post<GenericReponse<boolean>>('/price/update/'+link,body),
    delete:(id:number)=>requests.del<GenericReponse<true>>('delete/price/'+id)
  }

  const fileservice = (body:any)=>requests.post<{fileName:string,uploaded:number,url:string}>('/ckeditor/upload',body)

    const agent = {
      Login,
      slider,
      about,
      partner,
      news,
      newsCategory,
      service,
      serviceCategory,
      setting,
      contact,
      cover,
      progress,
      youtubeLink,
      price,
      fileservice
    }
  export default agent;