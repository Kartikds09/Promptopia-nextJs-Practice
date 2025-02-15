"use client"
import { useEffect } from 'react'
import {useState} from 'react'
import { useRouter ,useSearchParams} from 'next/navigation' 

import Form from '@components/Form'

const EditPrompt = () => {

    const router = useRouter();

    const searchParams = useSearchParams();
    const promptId = searchParams.get("id");
    console.log(promptId);

    const [submitting,setSubmitting] = useState(false);
    const [post,setPost] = useState({
        prompt: '',
        tag: '',
    });

    useEffect(()=>{
        const getPromptdetails = async () => {
            const response = await fetch(`/api/prompt/${promptId}`);
            const data = await response.json();
            setPost({
                prompt:data.prompt,
                tag:data.tag,
            })
        }

        if(promptId) getPromptdetails();
    },[promptId])

    const updatePrompt = async (e) => {
        e.preventDefault();
        setSubmitting(true);
    }
    // const createPrompt = async (e) => {
    //   e.preventDefault();
    //   setSubmitting(true);

    //   try {
    //     const response = await fetch('/api/prompt/new',{
    //       method: 'POST',
    //       body: JSON.stringify({
    //         prompt:post.prompt,
    //         userID: session?.user.id,
    //         tag: post.tag,
    //       })
    //     })
    //     if (response.ok){
    //       router.push('/');
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   } finally{
    //     setSubmitting(false);
    //   }
    // }

  return (
    <Form
    type="Edit"
    post={post}
    setPost = {setPost}
    submitting = {submitting}
    handleSubmit = {updatePrompt}
    />
  )
}

export default EditPrompt