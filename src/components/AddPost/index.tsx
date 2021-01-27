import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { Formik, Form } from 'formik';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@material-ui/icons/Close';

import { useMeQuery, useAddNewPostMutation, Post } from '../../generated/graphql';
import { LoadingContext } from '../../providers/LoadingProvider';
import Snackbar from '../SnackBar';

interface AddPostProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  totalCount: number;
  setTotalCount: React.Dispatch<React.SetStateAction<number>>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 600,
      margin: 'auto',
      marginTop: 50,
    },
    header: {
      backgroundColor: theme.palette.grey[100],
    },
    input: {
      display: 'none',
    },
    inputField: {
      width: '90%',
    },
    cardContent: {
      marginTop: 15,
      display: 'flex',
    },
    text: {
      marginLeft: 15,
      color: theme.palette.grey[400],
      alignSelf: 'flex-end',
    },
    imgWrap: {
      display: 'inline-block',
      position: 'relative',
    },
    close: {
      fontSize: 14,
      color: 'white',
      backgroundColor: theme.palette.grey[800],
      opacity: 0.8,
      borderRadius: '50%',
      position: 'absolute',
      top: -7,
      right: -7,
      transition: '* 0.2 linear',
      "&:hover": {
        cursor: 'pointer',
        backgroundColor: theme.palette.grey[900],
        transform: 'scale(1.1, 1.1)'
      }
    },
  }),
);

const AddPost: React.FC<AddPostProps> = ({
  posts,
  setPosts,
  currentPage,
  setCurrentPage,
  limit,
  totalCount,
  setTotalCount,
}) => {
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const data = useMeQuery();
  const { showLoader, hideLoader } = React.useContext(LoadingContext);
  const classes = useStyles();
  const [addPost, ] = useAddNewPostMutation();
  const [picture, setPicture] = useState<any>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    multiple: false,
    onDrop: acceptedFiles => {
      setPicture(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const handleClose = (_: React.SyntheticEvent | MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const removeImage = () => {
    setPicture([]);
  };

  const imgPreview = picture.map((file: any) => (
    <div className={classes.imgWrap} key={file.name}>
      <img width={250} height={140} src={file.preview} alt="uploadedImg" />
      <CloseIcon onClick={removeImage} className={classes.close} />
    </div>
  ));

  return (
    <>
      {
        !data.loading ?
          <Card className={classes.root}>
            <Formik
              initialValues={{
                content: '',
              }}
              validate={(value) => {
                let err: {
                  content: undefined | string,
                } | undefined;
                if (value.content.length > 120) {
                  err = {
                    content: 'Too Long',
                  };
                }
                return err;
              }}
              onSubmit={async (values, { resetForm, setErrors }) => {
                showLoader();
                if (values.content.trim().length === 0) {
                  setErrors({
                    content: "Can't be empty"
                  });
                  hideLoader();
                } else {
                  try {
                    const resp = await addPost({
                      variables: {
                        ...values,
                        picture: picture[0],
                      },
                      update: (cache, data) => {
                        if (data.data?.addNewPost.error === 'Please Login to Continue') {
                          cache.evict({ fieldName: 'me' });
                        }
                      },
                    });
                    console.log(resp);
                    hideLoader();
                    if (resp.errors) {
                      setErrMsg('Server Erorr. Please Try Again.');
                      setOpen(true);
                    } else if (resp.data?.addNewPost.error) {
                      if (resp.data?.addNewPost.error !== 'Please Login to Continue') {
                        setErrMsg(resp?.data?.addNewPost?.error || 'Error');
                        setOpen(true);
                      }
                    } else {
                      setPicture([]);
                      const newPost = resp.data?.addNewPost.post as Post;
                      if (currentPage !== 0) {
                        setCurrentPage(0);
                      } else {
                        const newPosts = [...posts];
                        newPosts.unshift(newPost);
                        if (posts.length >= limit) {
                          newPosts.pop();
                        }
                        setPosts(newPosts);
                      }
                      setTotalCount(totalCount + 1);
                      resetForm();
                    }
                  } catch(err) {
                    console.log(err.message);
                    setErrMsg('Server Erorr. Please Try Again.');
                    setOpen(true);
                    hideLoader();
                  }
                }
              }}
            >
              {({ getFieldProps, values, errors, submitForm, setFieldValue }) => (
                <Form>
                  <CardHeader
                    className={classes.header}
                    avatar={
                      <Avatar aria-label="profile-image" src={`https://robohash.org/${data.data!.me!.name}.png?set=set2`} />
                    }
                    action={
                      <>
                        <span {...getRootProps({className: 'dropzone'})}>
                          <input {...getInputProps()} />
                          <IconButton color="primary" aria-label="upload picture" component="span">
                            <PhotoCamera />
                          </IconButton>
                        </span>
                        <Button
                          color="primary"
                          disabled={errors.content ? errors.content?.length > 0 : false}
                          onClick={() => {
                            submitForm();
                          }}
                        >
                          Post
                        </Button>
                      </>
                    }
                    title={data.data!.me!.name}
                    subheader="What's on your mind today?"
                  />
                  <CardContent>
                    {imgPreview}
                    <div className={classes.cardContent}>
                      <FormControl
                        className={classes.inputField}
                        error
                      >
                        <InputBase
                          id="standard-textarea"
                          placeholder="Say something to the world."
                          multiline
                          {...getFieldProps('content')}
                        />
                        <FormHelperText id="component-error-text">{errors.content}</FormHelperText>
                      </FormControl>
                      <Typography className={classes.text} variant="caption" display="block" gutterBottom>
                        {values.content.length}/120
                      </Typography>
                    </div>
                  </CardContent>
                </Form>
              )}
            </Formik>
            <Snackbar message={errMsg} open={open} handleClose={handleClose} />
          </Card>
        : null
      }
    </>
  );
};

export default AddPost;
