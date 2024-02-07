import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t bg-slate">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <Link href="/">
          <h2 className="text-tan">campify</h2>
        </Link>

        <p className="text-tan">2024 campify. All Rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
