export type SliderType = {
    id: number,
    title_az: string,
    title_en: string,
    title_ru: string,
    description_az: string,
    description_ru: string,
    description_en: string,
    image: string,
    link_title_az: string,
    link_title_ru: string,
    link_title_en: string,
    link: string,
    created_at: Date,
    updated_at: Date
}
export type YoutubeLinkType = {
    title_az:string;
    title_en:string
    title_ru:string;
    id:number,
    image:string,
    link:string 
}
export type PriceType = {
    title_az:string;
    title_en:string
    title_ru:string;
    id:number,
    price:string ,
    service_id:number,
    service_title:string
}
export type ProgressType = {
    title_az:string;
    title_en:string
    title_ru:string
    icon:string
    id:number
}
export type AboutType = {
    id:number,
    title_az:string,
    title_en:string,
    title_ru:string,

    description_az:string,
    description_en:string,
    description_ru:string,
    image:string,
    created_at:string,
    updated_at:string
}
export type PartnerType = {
    id:number
    logo:string
}
export type NewsType = {
    id: number,
    category_id: number,
    title_az: string,
    title_ru: string,
    title_en: string,
    description_az: string,
    description_ru: string,
    description_en: string,
   
    image: string,
    created_at: Date,
    updated_at: Date
}

export type SettingsType = {
    id: number,
    instagram: string,
    tiwitter: string,
    facebook: string,
    youtube: string,
    created_at: Date,
    updated_at: Date
}
export type ContactType = {
    id: number,
    email: string,
    address: string,
    phone: string,
    created_at: Date,
    updated_at: Date
}

