import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from "../index"
import serviceobj from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Postform({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    })

    const navigate = useNavigate();
    const userdata = useSelector((state) => state.auth.userdata);

    const submit = async (data) => {
        if (post) {
            const file = data.image[0] ? await serviceobj.uploadfile(data.image[0]) : null;

            if (file) {
                serviceobj.deletefile(post.featuredimage)
            }

            const dbpost = await serviceobj.updatepost(post.$id, { 
                ...data, 
                featuredimage: file ? file.$id : undefined 
            });

            if (dbpost) {
                navigate(`/post/${dbpost.$id}`)
            }
        } else {
            const file = await serviceobj.uploadfile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                data.featuredimage = fileId;
                const dbpost=await serviceobj.createpost({
                    ...data,
                    userid: userdata.$id
                });

                if (dbpost) {
                    navigate(`/post/${dbpost.$id}`)
                }
            }
        }
    };

    const slugtransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z\d\s]+/g, "-")
            .replace(/\s/g, "-")
        }

        return "";
    }, [])


    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugtransform(value.title, { shouldValidate: true }))
            }
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [watch, slugtransform, setValue])


    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-3"
                    {...register("title", { required: true })}
                />
                
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugtransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />


                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>

            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />

                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={serviceobj.previewfile(post.featuredimage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}



                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />

                <Button type="submit" bgcolor={post ? "bg-blue-500" : "bg-green-500"}>
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
