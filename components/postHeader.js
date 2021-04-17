import PropTypes from 'prop-types';

const HeadPost = ({ meta, isBlogPost }) => (
  <>
    <div className={isBlogPost ? 'mt-4' : ''}>
      <h1
        className={`${
          isBlogPost
            ? 'font-extrabold text-6xl leading-compact'
            : 'font-bold text-2xl mt-0 overflow-hidden overflow-ellipsis twoLines'
        } text-yellow mb-2`}
      >
        {meta.title}
      </h1>
      {isBlogPost ? null : <p className="text-gray-50">{meta.description}</p>}
    </div>

    <div>
      {!isBlogPost ? (
        <span className="text-gray-300 mr-4">Read more →</span>
      ) : null}
    </div>
  </>
);

HeadPost.propTypes = {
  meta: PropTypes.object,
  isBlogPost: PropTypes.bool,
};

export default HeadPost;