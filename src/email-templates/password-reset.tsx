import React from "react";
import { Link } from "@react-email/components";

interface PasswordResetProps {
    name: string;
    passwordResetLink: string
}


const PasswordReset = ({ name, passwordResetLink }: PasswordResetProps) : React.ReactElement => (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Click the link below to reset your passoword</p>
      <Link href={`${passwordResetLink}`}>Reset Passord</Link>
    </div>
);

export default PasswordReset;

