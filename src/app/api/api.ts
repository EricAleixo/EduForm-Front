import axios from "axios";
import { StudentFormData } from "../types/formData.types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/students";

export const postStudents = async (formData: StudentFormData) => {
    return await axios.post(apiUrl + "/students", formData);
}