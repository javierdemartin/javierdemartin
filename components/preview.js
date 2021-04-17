import PropTypes from 'prop-types';
import Link from 'next/link';

const PostPreview = ({ post }) => {
  const {
    link,
    module: { meta },
  } = post;

  return (
    <div className="rounded h-48 bg-gray-800 hover:bg-gray-700 transition-colors my-2">
        <p>
            {link}
        </p>
      <Link href={`/public/posts${link}`}>
        <a className="flex h-full">
        </a>
      </Link>
    </div>
  );
};

PostPreview.propTypes = {
  post: PropTypes.object,
};

export default PostPreview;