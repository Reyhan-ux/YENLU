import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';

/** 404 page. */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16">
      <p className="mb-4 text-center text-7xl font-light tracking-tight text-leaf-500">404</p>
      <EmptyState
        icon={Compass}
        title="This page doesn't exist"
        text="The link may be out of date. Go back to your dashboard to continue."
        action={<Link to="/"><Button>Back to dashboard</Button></Link>}
      />
    </div>
  );
}
