import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Pagination from '@material-ui/lab/Pagination';

import AddPost from '../AddPost';
import { Post, useGetPostsLazyQuery } from '../../generated/graphql';
import SkeletonCard from '../SkeletonCard';
import SinglePost from '../SinglePost';

interface PostsProps {};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bg: {
      minHeight: '100vh',
      marginBottom: 20,
    },
    divider: {
      marginTop: 20,
    },
    pagination: {
      margin: '50px auto',
      width: '85%',
    }
  }),
);

const Posts: React.FC<PostsProps> = () => {
  const classes = useStyles();
  const limit = 5;
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [loadPosts, { loading }] = useGetPostsLazyQuery({
    variables: {
      limit,
      page: 0,
    },
    onCompleted: (postData) => {
      if (postData.getPosts.posts) {
        setPosts(postData.getPosts.posts as Post[]);
        const count = postData.getPosts.count as number;
        setTotalCount(count);
      }
    },
    onError: (e) => {
      console.log(e.message);
    },
    fetchPolicy: 'network-only',
  });
  
  const fetchData = (page: number) => {
    loadPosts({
      variables: {
        limit,
        page,
      }
    });
  }

  const handleChange = (_: any, value: number) => {
    setCurrentPage(value - 1);
  };
  
  useEffect(() => {
    window.scroll({top: 0, left: 0, behavior: 'smooth' });
    fetchData(currentPage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <Container className={classes.bg} maxWidth="sm">
      <AddPost
        posts={posts}
        setPosts={setPosts}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limit={limit}
        totalCount={totalCount}
        setTotalCount={setTotalCount}
      />
      <Divider className={classes.divider} variant="middle" />
      {
        loading ? 
          <SkeletonCard />
        : (
          <>
            { posts.map((post) => {
              return <SinglePost
                key={post.id}
                postId={post.id}
                username={post.creator.name}
                content={post.content}
                createdOn={new Date(Number(post.createdAt))}
                imgUrl={post.imagePath}
                isUserLiked={post.hasUserLiked}
                numberOfLikes={post.numberOfLikes}
              />
            })}
            <Pagination
              showFirstButton
              showLastButton
              className={classes.pagination}
              count={Math.ceil(totalCount / limit)}
              page={currentPage + 1}
              onChange={handleChange}
              color="primary"
            />
          </>
        )
      }
    </Container>
  );
};

export default Posts;
