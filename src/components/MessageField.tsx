export default function MessageField({ message }: { message: string }) {
  return (
    <div className="self-end px-4 py-2 rounded-4xl text-lg dark:bg-[#303030]">
      {message}
    </div>
  );
}
