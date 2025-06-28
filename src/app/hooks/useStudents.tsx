import { useState } from "react"
import { postStudents } from "../api/api";
import { StudentFormData } from "../types/formData.types";
import { AxiosError } from "axios";

export const useStudents = () =>{
    const [result, setResult] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createStudent = async (formData: StudentFormData) =>{
        setLoading(true);
        setResult(null);
        setError(null);
        try{
            const response = await postStudents(formData);
            if(response.status === 201){
                setResult(true);
                return { success: true, message: 'Estudante cadastrado com sucesso!' };
            }
            setResult(false);
            return { success: false, message: 'Resposta inesperada do servidor' };
        } catch(err) {
            console.log("Erro ao enviar os dados:", err);
            
            let errorMessage = 'Erro desconhecido ao enviar os dados';
            
            if (err instanceof AxiosError) {
                if (err.response) {
                    // Erro com resposta do servidor
                    const status = err.response.status;
                    const data = err.response.data;
                    
                    switch (status) {
                        case 409:
                            errorMessage = data?.message || 'Este estudante já está cadastrado no sistema';
                            break;
                        case 400:
                            errorMessage = data?.message || 'Dados inválidos. Verifique as informações enviadas';
                            break;
                        case 422:
                            errorMessage = data?.message || 'Dados de validação incorretos';
                            break;
                        case 500:
                            errorMessage = 'Erro interno do servidor. Tente novamente mais tarde';
                            break;
                        default:
                            errorMessage = data?.message || `Erro ${status}: ${data?.error || 'Erro no servidor'}`;
                    }
                } else if (err.request) {
                    // Erro de rede/conexão
                    errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente';
                } else {
                    // Outros erros
                    errorMessage = err.message || 'Erro inesperado ao processar a requisição';
                }
            } else {
                errorMessage = err instanceof Error ? err.message : 'Erro inesperado';
            }
            
            setError(errorMessage);
            setResult(false);
            return { success: false, message: errorMessage };
        } finally{
            setLoading(false)
        }
    }

    return {result, loading, error, createStudent}

}