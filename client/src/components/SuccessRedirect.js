import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessRedirect = ({ message, redirectTo }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(redirectTo);
        }, 3000); // Redirect after 3 seconds

        return () => clearTimeout(timer); // Cleanup timer
    }, [navigate, redirectTo]);

    return (
        
  <div class="gearbox">
  <div class="overlay"></div>
    <div class="gear one">
      <div class="gear-inner">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </div>
    <div class="gear two">
      <div class="gear-inner">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </div>
    <div class="gear three">
      <div class="gear-inner">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </div>
    <div class="gear four large">
      <div class="gear-inner">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </div>
  </div>

    );
};

export default SuccessRedirect;
