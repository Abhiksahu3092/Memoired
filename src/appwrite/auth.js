import conf from '../conf/conf'
import { Client, Account, ID } from "appwrite";

export class authservice{
    client=new Client();
    account;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteurl)
            .setProject(conf.appwriteprojectId);
        this.account=new Account(this.client);
    }

    async createaccount({email,password,name}){
        try {
            const useraccount=await this.account.create(ID.unique(),email,password,name);

            if(useraccount){
                //call another method
                return this.login({email,password});
            }
            else{
                return useraccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({email,password}){
        try {
            return await this.account.createEmailPasswordSession(email,password);
        } catch (error) {
            throw error;
        }
    }

    async currentloginstatus(){
        try {
            return await this.account.get();
        } catch (error) {
            //console.log("appwrite service:: currentloginstatus:: error",error);
        }

        //return null;
    }

    async logout(){
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("appwrite service:: logout:: error",error);
        }
    }
}

const authobj=new authservice()

export default authobj;