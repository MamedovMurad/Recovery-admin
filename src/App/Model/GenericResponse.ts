export type GenericReponse<T> = {
    error:null|{message:string}
    data:T
}