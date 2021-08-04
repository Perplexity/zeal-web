import React, { forwardRef } from 'react';
import { Helmet } from 'react-helmet';
import { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

const Page = forwardRef(({ children, title = '', ...rest }: Props, ref) => {
  return (
    <div {...rest}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </div>
  );
});

export default Page;
