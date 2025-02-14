import DropzoneForm from "@/components/ui/dropzone-form";

export default function Home() {
  return (
    <div className="flex h-full flex-col gap-y-6 md:text-center md:items-center align-center">
      <div>
        <h1 className="text-4xl font-bold">
          Tired of reading 100s of pages? Insert your PDF below
        </h1>
        <p className="text-muted-foreground mt-2">
          Simply drag and drop your PDF, and start chatting with it instantly!
        </p>
      </div>
      <div className="max-w-xl w-full">
        <DropzoneForm />
      </div>
    </div>
  );
}
