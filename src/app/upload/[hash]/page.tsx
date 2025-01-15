import checkFileExistence from "@/actions/checkFileExistence";
import Features from "@/components/features";
import Hero from "@/components/hero";
import UploadBlocked from "@/components/upload-blocked";

interface UploadPageParams {
  params: Promise<{
    hash: string;
  }>;
}

export default async function UploadPage({ params }: UploadPageParams) {
  const { hash } = await params;

  const isValidLink = await checkFileExistence(
    process.env.AWS_BUCKET!,
    `${hash}.request`
  );
  const fileExists = await checkFileExistence(process.env.AWS_BUCKET!, hash);

  console.log({ isValidLink, fileExists });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <main className="container mx-auto px-4 py-8">
        {(fileExists || !isValidLink) && (
          <UploadBlocked>
            <p className="text-center text-red-700">
              File already exists on the server. Please request another upload
              url from me. Sorry for your inconvenience!
            </p>
          </UploadBlocked>
        )}
        {!fileExists && isValidLink && (
          <>
            <Hero hash={hash} />
            <Features />
          </>
        )}
      </main>
    </div>
  );
}
