import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function InfluencerAuthPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isLogin) {
        // INFLUENCER LOGIN
        const res = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });

        const token =
          res.data?.token ||
          res.data?.accessToken ||
          res.data?.data?.token;

        if (token) {
          localStorage.setItem("ql_token", token);
        }

        toast.success("Login successful!");

        navigate("/influencer/campaigns");
      } else {
        // INFLUENCER REGISTER
        const res = await api.post("/auth/register", {
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
          role: "influencer",
        });

        const token =
         
