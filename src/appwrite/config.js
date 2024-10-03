import conf from'../conf/conf.js'
import { Client,ID,Databases,Storage,Query } from "appwrite";

export class service{
    client = new Client();
    database;
    bucket; //storage
    constructor(){
        this.client
        .setEndpoint(conf.appwriteurl)
        .setProject(conf.appwriteprojectId);
        this.database=new Databases(this.client);
        this.bucket= new Storage(this.client);
    }


    //database services

    async createpost({title,slug,content,featuredimage,status,userid}){
        try {
            return await this.database.createDocument(
                conf.appwritedatabaseId,
                conf.appwritecollectionId,
                slug,
                {
                    title,
                    content,
                    featuredimage,
                    status,
                    userid,
                }
            )
        } catch (error) {
            console.log("appwrite service:: createpost:: error",error);
        }
    }

    async updatepost(slug,{title,content,featuredimage,status}){
        try {
            return await this.database.updateDocument(
                conf.appwritedatabaseId,
                conf.appwritecollectionId,
                slug,
                {
                    title,
                    content, 
                    featuredimage,
                    status,
                }
            )
        } catch (error) {
            console.log("appwrite service:: updatepost:: error",error);
        }
    }

    async deletepost(slug){
        try {
            await this.database.deleteDocument(
                conf.appwritedatabaseId,
                conf.appwritecollectionId,
                slug,
            )
            return true;
        } catch (error) {
            console.log("appwrite service:: deletepost:: error",error);
            return false;
        }
    }

    async getpost(slug){
        try {
            return await this.database.getDocument(
                conf.appwritedatabaseId,
                conf.appwritecollectionId,
                slug,
            )
        } catch (error) {
            console.log("appwrite service:: getpost:: error",error);
            return false;
        }
    }

    //we want to get all the post which have an active status
    //we need to learn about queries here in appwrite
    async getallposts(queries=[Query.equal("status","active")]){
        try {
            return await this.database.listDocuments(
                conf.appwritedatabaseId,
                conf.appwritecollectionId,
                queries,
            )
        } catch (error) {
            console.log("appwrite service:: getallposts:: error",error);
            return false;
        }
    }

    //storage services
    async uploadfile(file){
        try {
            return await this.bucket.createFile(
                conf.appwritebucketId,
                ID.unique(),
                file,
            )
        } catch (error) {
            console.log("appwrite service:: upload:: error",error);
        }
    }

    async deletefile(fileid){
        try {
            await this.bucket.deleteFile(
                conf.appwritebucketId,
                fileid,
            )
            return true;
        } catch (error) {
            console.log("appwrite service:: delete:: error",error);
            return false;
        }
    }

    previewfile(fileid){
        return this.bucket.getFilePreview(
            conf.appwritebucketId,
            fileid,
        )
    }

    
}

const serviceobj=new service();

export default serviceobj;