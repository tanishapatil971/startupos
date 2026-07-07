"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    google: any;
  }
}

export default function IntegrationsPage() {
  const [connected, setConnected] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [accessToken, setAccessToken] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [loading, setLoading] = useState(false);


  function connectGoogleWorkspace() {

    const client =
      window.google.accounts.oauth2.initTokenClient({

        client_id:
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,

        scope:
          "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/spreadsheets.readonly",

        callback: async (response: any) => {


          setAccessToken(response.access_token);


          const driveResponse = await fetch(
            "https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType)",
            {
              headers: {
                Authorization:
                  `Bearer ${response.access_token}`,
              },
            }
          );


          const result =
            await driveResponse.json();


          setFiles(result.files || []);

          setConnected(true);

        },

      });


    client.requestAccessToken();

  }




  async function readWorkspaceFile(file: any) {

    console.log(
      "Selected file:",
      file
    );


    let url = "";


    if (
      file.mimeType ===
      "application/vnd.google-apps.document"
    ) {

      url =
        `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`;

    }


    else if (
      file.mimeType ===
      "application/vnd.google-apps.spreadsheet"
    ) {

      url =
        `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/csv`;

    }


    else {

      alert(
        "Please select Google Docs or Google Sheets file."
      );

      return;

    }



    const response =
      await fetch(
        url,
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );


    const text =
      await response.text();


    console.log(
      "FILE TEXT:",
      text
    );


    setDocumentText(
      text || "No content found"
    );


    alert(
      "Document loaded"
    );

  }





  async function analyzeWorkspace() {

    setLoading(true);


    const response =
      await fetch(
        "/api/analyze",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              idea: documentText,
            }),

        }
      );


    const result =
      await response.json();



    const {
      data: { user },
    } =
      await supabase.auth.getUser();



    if (user) {

      await supabase
        .from("reports")
        .insert({

          user_id:
            user.id,

          goal:
            "Google Workspace Analysis",

          health_score:
            result.healthScore,

          risks:
            result.risks,

          opportunities:
            result.opportunities,

          next_actions:
            result.nextActions,

          roadmap:
            result.roadmap,

        });

    }



    setLoading(false);


    alert(
      "Analysis saved 🚀"
    );

  }







  return (

    <main className="min-h-screen px-8 py-10 text-white">


      <h1 className="shimmer-text text-5xl font-bold leading-tight pb-2">

        Integrations

      </h1>


      <p className="mb-10 text-gray-400">

        Connect your startup workspace.

      </p>




      <div className="glass rounded-3xl p-8">


        <button

          onClick={connectGoogleWorkspace}

          className="
            rounded-2xl
            bg-white
            px-6
            py-3
            font-semibold
            text-black
          "
        >

          {connected
            ? "Connected ✓"
            : "Connect Google Workspace"}

        </button>





        <div className="mt-8 space-y-3">


          {files.map((file) => (

            <div

              key={file.id}

              onClick={() =>
                readWorkspaceFile(file)
              }


              className="
                cursor-pointer
                rounded-xl
                bg-white/[0.05]
                p-4
                hover:bg-white/[0.1]
              "

            >


              📄 {file.name}


              <p className="text-xs text-gray-500">

                {file.mimeType}

              </p>


            </div>

          ))}


        </div>


      </div>






      {documentText && (

        <div className="glass mt-8 rounded-3xl p-8">


          <h2 className="text-2xl font-semibold">

            AI Workspace Context

          </h2>



          <p className="
            mt-5
            max-h-60
            overflow-y-auto
            whitespace-pre-wrap
            text-gray-300
          ">

            {documentText}

          </p>




          <button

            onClick={analyzeWorkspace}

            disabled={loading}

            className="
              mt-6
              rounded-2xl
              bg-indigo-500
              px-6
              py-3
              font-semibold
            "

          >

            {loading
              ? "Analyzing..."
              : "✨ Analyze Workspace"}

          </button>



        </div>

      )}



    </main>

  );
}