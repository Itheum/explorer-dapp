import React, { useEffect, useState } from "react";
import styled from "styled-components";

const SwitchButtonStyle = styled.label<{ $isDarkMode?: boolean; }>`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${(props: any) => props.isDarkMode ? '#111827' : '#374151'};
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }

  span:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: ${(props: any) => props.isDarkMode ? '#E5E7EB' : '#E5E7EB'};
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + span {
    background-color: ${(props: any) => props.isDarkMode ? '#E5E7EB' : '#374151'};
  }

  input:focus + span {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + span:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
`;

export function SwitchButton() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    setIsDarkMode(localStorage.getItem('is-dark-mode') == 'true');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('is-dark-mode', isDarkMode ? 'true' : 'false');
  },[isDarkMode]);

  return (
    <SwitchButtonStyle $isDarkMode={isDarkMode}>
      <input
        type="checkbox"
        onChange={() => setIsDarkMode(!isDarkMode)}
      />
      <span></span>
    </SwitchButtonStyle>
  );
}