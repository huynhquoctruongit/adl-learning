import Link from 'next/link';
import { useEffect } from 'react';
import axios from 'axios';

export default function Custom404() {
  // useEffect(() => {
  //   axios
  //     .get('http://zone97.vivas.vn:44552/partner/apis/home', {
  //       headers: {
  //         'api-key': '$2a$12$4ZNnUv4pNrR8hQLzS2LpfO5bn6lCY3N66fJGQUWlSEY2JBeM/QX3O'
  //       }
  //     })
  // });
  return (
    <div>
      <img className="w-[45rem] mx-auto" src="/images/not-found.jpg" alt="" />

      <div className="text-center">
        <h2>
          Go to{' '}
          <Link href="/" passHref>
            <a className="text-blue-600">home page</a>
          </Link>
        </h2>
      </div>
    </div>
  );
}
