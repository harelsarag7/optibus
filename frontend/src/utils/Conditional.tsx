import React from 'react';

/**
 * Conditional rendering components for better readability
 */

interface IfProps {
  condition: boolean;
  children: React.ReactNode;
}

export const If: React.FC<IfProps> = ({ condition, children }) => {
  return condition ? <>{children}</> : null;
};

interface ChooseProps {
  children: React.ReactNode;
}

export const Choose: React.FC<ChooseProps> = ({ children }) => {
  const childrenArray = React.Children.toArray(children);

  for (const child of childrenArray) {
    if (React.isValidElement<WhenProps>(child)) {
      if (child.type === When && child.props.condition) {
        return <>{child.props.children}</>;
      }
    }
  }

  // Return Otherwise if no When condition is met
  for (const child of childrenArray) {
    if (React.isValidElement<OtherwiseProps>(child) && child.type === Otherwise) {
      return <>{child.props.children}</>;
    }
  }

  return null;
};

interface WhenProps {
  condition: boolean;
  children: React.ReactNode;
}

export const When: React.FC<WhenProps> = ({ children }) => {
  return <>{children}</>;
};

interface OtherwiseProps {
  children: React.ReactNode;
}

export const Otherwise: React.FC<OtherwiseProps> = ({ children }) => {
  return <>{children}</>;
};
