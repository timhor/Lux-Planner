export class NewAccount {
   
   constructor(
      public username: string,
      public password: string,
      public confirmPassword: string,
      public email: string,
      public firstName: string,
      public lastName: string,
   ) { }

}