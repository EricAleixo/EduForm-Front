import axios from "axios";
import { StudentFormData } from "../types/StudentFormData.types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const postStudents = async (formData: FormData) => {
    return await axios.post(apiUrl + "/student", formData,
        {
            headers: { "Content-type": "multipart/form-data" }
        }
    );
}