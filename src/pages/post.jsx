import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import serviceobj from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setpost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userdata = useSelector((state) => state.auth.userdata);

    const isAuthor = post && userdata ? post.userid === userdata.$id : false;

    useEffect(() => {
        if (slug) {
            serviceobj.getpost(slug).then((post) => {
                if (post) setpost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletepost = () => {
        serviceobj.deletepost(post.$id).then((status) => {
            if (status) {
                serviceobj.deletefile(post.featuredimage);
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    <img
                        src={serviceobj.previewfile(post.featuredimage)}
                        alt={post.title}
                        className="rounded-xl"
                    />

                </div>
                    {isAuthor && (
                        <div className="w-full flex justify-center mb-4 relative p-2">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgcolor="bg-blue-500">
                                    Edit
                                </Button>
                            </Link>
                            <span className="w-4"></span>
                            <Button bgcolor="bg-red-500" onClick={deletepost}>
                                Delete
                            </Button>
                        </div>
                    )}
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css">
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : null;
}