export default function Footer() {
    return (
      <footer className="text-center text-sm text-gray-400 mt-2">
        © {new Date().getFullYear()}{" "}
        <a
          href="https://www.linkedin.com/in/prathamesh-jadhav-4a920725a/" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Space Club RIT
        </a>. All rights reserved.
      </footer>
    );
  }
  