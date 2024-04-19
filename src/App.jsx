import Editor from "@monaco-editor/react";
import { useState, useRef } from "react";
import rotate from "./assets/rotate.png";

export const App = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(""); //* Estado para almacenar el resultado del código
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setLoading(!loading);
  }

  const editorRef = useRef(null);

  const handleCodeDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleSave = async () => {
    handleToggle()
    const codeValue = editorRef.current.getValue();
    console.log(codeValue); // *Puedes eliminar esta línea si no necesitas imprimir el código en la consola
    setResult(await runCode(codeValue)); // *Ejecutar el código y actualizar el estado del resultado

    const gemini = await fetch("http://localhost:8000/consultas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ consulta: `Explicame esta codigo: ${codeValue} Lenguaje:javascript, Solo responde si esta bien o mal, di el error pero no des la respuesta` }),
    });

    const api = await fetch("http://jsonplaceholder.typicode.com/posts/1")

    const dataGemini = await gemini.json();

    setData(dataGemini);

  };

  //* Función para ejecutar el código y devolver el resultado
  const runCode = async (code) => {
    try {
      // *Puedes usar eval() para ejecutar el código, pero ten en cuenta que no es seguro en muchos casos.
      // *Se recomienda usar bibliotecas como Babel o transpiladores para ejecutar código dinámico de manera segura en un entorno de producción.
      const result = await eval(code);
      return result;
    } catch (error) {
      console.error("Error al ejecutar el código:", error);
      return error.toString();
    }
  };

  return (
    <>
      <article className="bg-slate-800 flex flex-col max-w-screen min-h-screen">

        <div className="pb-5">
          <h1 className="text-white text-3xl text-center font-bold">Monaco Editor</h1>
        </div>

        <section className="grid grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 border-b border-t border-white pb-5">

          <section className="">
            <Editor
              height={"50vh"}
              theme={"vs-dark"}
              defaultLanguage={"javascript"}
              value={code}
              onChange={(value) => setCode(value)}
              onMount={handleCodeDidMount}
            />
            <div className="flex items-center justify-center pt-3">
              <button className="p-1 font-semibold bg-yellow-500 rounded border-2 border-black hover:bg-yellow-800 hover:text-gray-300 transition-colors" onClick={handleSave}>¡Probar!</button>
            </div>
          </section>


          <section className="flex flex-col justify-center items-center">
            <h2 className="text-white font-semibold text-center flex-1 underline">Resultado del codigo:</h2>

            <div className="rounded-md text-white bg-gray-700 border-2 border-white">
              {typeof result === 'object' && result !== null ? (
                <pre>{JSON.stringify(result, null, 2)}</pre>
              ) : (
                <pre className="w-[100vh] h-[50vh]">{result}</pre>
              )}
            </div>

          </section>
        </section>


        <section className="flex justify-center items-center flex-col">
          <h3 className="font-semibold underline text-white pb-3">Respuesta de la IA:</h3>
          <p className="bg-gray-800 border-2 border-white rounded text-white">{data}</p>

          <div className={`${loading ? "visible" : "hidden"}`} >
            <img className={`${data !== "" && "invisible"} items-center justify-center animate-spin`} width={"40px"} height={"40px"} src={rotate} alt="loading..." />
          </div>

        </section>

      </article>
    </>
  );
};
