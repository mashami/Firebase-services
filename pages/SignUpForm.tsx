import React, { useState } from "react";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
`;

const Input = styled.input`
  margin-bottom: 16px;
  padding: 8px;
  border: 1px solid gray;
  background-color: black;
`;

const Button = styled.button`
  margin-top: 16px;
  padding: 8px;
  border: none;
  background-color: blue;
  color: white;
  cursor: pointer;
`;

// type SignUpFormProps = {
//   onSignUp: (email: string, password: string) => void;
// };


interface SignUpFormProps {
  onSignUp: (email: string, password: string) => void;
}



// component: JS(above return statement), TSX(HTML + TS)
const SignUpForm = (props: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  let x = 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
    
      props.onSignUp(email, password)
      // onSignUp(email, password);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label>
        Email
        <Input
          type="email"
          value={email}
          onChange={(event: { target: { value: React.SetStateAction<string>; }; }) => setEmail(event.target.value)}
        />
      </Label>
      <Label>
        Password
        <Input
          type="password"
          value={password}
          onChange={(event: { target: { value: React.SetStateAction<string>; }; }) => setPassword(event.target.value)}
        />
      </Label>
      <Label>
        Confirm Password
        <Input
          type="password"
          value={confirmPassword}
          onChange={(event: { target: { value: React.SetStateAction<string>; }; }) => setConfirmPassword(event.target.value)}
        />
      </Label>
      <Button type="submit">Sign Up</Button>
    </Form>
  );
};

export default SignUpForm;
