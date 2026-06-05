'use client';

import { useState } from "react"
import { toast, ToastContainer } from "react-toastify";

interface UserLoginType {
    username: string;
    password: string;
}

function Page() {
    const [formData, setFormData] = useState<UserLoginType>({
        username: "",
        password: ""
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(formData.username == "admin" && formData.password == "123"){
            toast.success("Login successful");
        }
    }

    return (
        <div>
            <ToastContainer/>
            <div>
                <form method="POST" onSubmit={handleSubmit}>
                    <div>
                        <label>Username: </label>
                        <input type="text" name="username" required onChange={(e) => setFormData({...formData, username: e.target.value})}/>
                    </div>
                    <div>
                        <label>Password: </label>
                        <input type="password" name="password" required onChange={(e) => setFormData({...formData, password: e.target.value})}/>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Page
