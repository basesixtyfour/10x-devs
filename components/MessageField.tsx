export default function MessageField({ content }: { content: string }) {
  return (
    <div className="self-end px-4 mx-4 py-2 rounded-4xl text-lg dark:bg-[#303030]">
      {content}
    </div>
  );
}
