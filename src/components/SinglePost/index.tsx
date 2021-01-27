import React, { useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { useLikePostMutation } from '../../generated/graphql';

interface SinglePostProps {
  postId: number;
  content: string;
  username: string;
  createdOn: Date;
  imgUrl: string | null | undefined;
  numberOfLikes: number;
  isUserLiked: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 600,
      margin: 'auto',
      marginTop: theme.spacing(2),
    },
    media: {
      height: 0,
      paddingTop: '56.25%',
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
    text: {
      margin: 'auto 0',
      color: theme.palette.grey[700],
    },
    liked: {
      color: '#FE2733'
    }
  }),
);


const SinglePost: React.FC<SinglePostProps> = ({
  postId,
  content,
  username,
  createdOn,
  imgUrl,
  numberOfLikes,
  isUserLiked,
}) => {
  const classes = useStyles();
  const [noOfLikes, setNoOfLikes] = useState(numberOfLikes);
  const [isLiked, setIsLiked] = useState(isUserLiked);
  const [likePost, ] = useLikePostMutation();
  const toggleLike = async () => {
    if (isLiked) {
      setNoOfLikes(noOfLikes - 1);
    } else {
      setNoOfLikes(noOfLikes + 1);
    }
    setIsLiked(!isLiked);
    await likePost({
      variables: {
        postId,
      },
    });
  };
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="profile-image" src={`https://robohash.org/${username}.png?set=set2`} />
        }
        title={username}
        subheader={createdOn.toLocaleDateString('in')}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {content}
        </Typography>
      </CardContent>
      {
        !!imgUrl ?
          <CardMedia
            className={classes.media}
            image={imgUrl}
            title="Post Image"
          />
        : null
      }
      <CardActions disableSpacing>
        <IconButton onClick={toggleLike} aria-label="add to favorites">
          <FavoriteIcon className={isLiked ? classes.liked : ''} />
        </IconButton>
        <Typography className={classes.text} variant="caption" display="block" gutterBottom>
          {noOfLikes} Likes
        </Typography>
      </CardActions>
    </Card>
  );
};

export default SinglePost;
