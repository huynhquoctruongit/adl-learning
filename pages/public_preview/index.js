import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ContentBlock from '@/components/common/mathtype';

const Preview = () => {
  const router = useRouter();
  const [state, setState] = useState('');

  useEffect(() => {
    console.log('trigger build');
    if (!router.query.hash) return;
    axios
      .get('https://interaction-adl.dev.icanx.vn/interaction/public/get_preview?hash=' + router.query.hash)
      .then((res) => {
        setState(res?.data?.payload?.content || res.payload.content || '');
      });
  }, [router.query.hash]);

  return (
    <div className="py-20 max-w-[700px] mx-auto">
      <ContentBlock content={state} className="content-mathjax" />
    </div>
  );
};
export default Preview;
Preview.permission = 'public';
