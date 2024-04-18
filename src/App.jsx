import Editor from "@monaco-editor/react";
import { useState, useRef } from "react";

export const App = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(""); //* Estado para almacenar el resultado del código
  const [data, setData] = useState("");

  const editorRef = useRef(null);

  const handleCodeDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleSave = async () => {
    const codeValue = editorRef.current.getValue();
    console.log(codeValue); // *Puedes eliminar esta línea si no necesitas imprimir el código en la consola
    setResult(await runCode(codeValue)); // *Ejecutar el código y actualizar el estado del resultado

    // const gemini = await fetch("http://192.168.148.98:8000/consultas", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ consulta: `que hace esta funcion? ${codeValue}` }),
    // });

    // const gemini = await fetch("http://jsonplaceholder.typicode.com/posts/1")

    // const dataGemini = await gemini.json();

    // setData(dataGemini);
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
      <div>
        <h1>Monaco Editor</h1>

        <button onClick={handleSave}>Save</button>
        <Editor
          height={"50vh"}
          theme={"vs-dark"}
          defaultLanguage={"javascript"}
          value={code}
          onChange={(value) => setCode(value)}
          onMount={handleCodeDidMount}
        />

        <div>
          <h2>Output:</h2>
          {typeof result === 'object' && result !== null ? (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          ) : (
            <pre>{result}</pre>
          )}      </div>
      </div>

      <div>
        <h3>Respuesta de la IA</h3>
        {/* <p>{data}</p> */}
      </div>
    </>
  );
};
