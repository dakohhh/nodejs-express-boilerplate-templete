import React from "react";
import { Link } from "@react-email/components";

interface EmailVerificationProps {
    name: string;
    verificationLink: string
}


const EmailVerification = ({ name, verificationLink }: EmailVerificationProps) : React.ReactElement => (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Click the link below to verify your account</p>
      <Link href={`${verificationLink}`}>Verify</Link>
    </div>
);

export default EmailVerification;

