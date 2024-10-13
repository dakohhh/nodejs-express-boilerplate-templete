import React from 'react';

interface WelcomeEmailProps {
    name: string;
}

const WelcomeEmail = ({ name }: WelcomeEmailProps): React.ReactElement => (
    <div>
        <h1>Welcome, {name}!</h1>
        <p>Thank you for joining our service. We're excited to have you on board.</p>
    </div>
);

export default WelcomeEmail;
