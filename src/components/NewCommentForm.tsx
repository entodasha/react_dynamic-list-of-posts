import cn from 'classnames';
import React, { useState } from 'react';
import { Comment } from '../types/Comment';
import { createComment } from '../api/api';

type Props = {
  postId: number;
  setIsError: (value: boolean) => void;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
};

export const NewCommentForm: React.FC<Props> = ({
  postId,
  setComments,
  setIsError,
}) => {
  const [nameQuery, setNameQuery] = useState('');
  const [emailQuery, setEmailQuery] = useState('');
  const [commentQuery, setCommentQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nameInvalid, setNameInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [commentInvalid, setCommentInvalid] = useState(false);

  const onNameChange = (value: string) => {
    setNameQuery(value);
    setNameInvalid(false);
  };

  const onEmailChange = (value: string) => {
    setEmailQuery(value);
    setEmailInvalid(false);
  };

  const onCommentChange = (value: string) => {
    setCommentQuery(value);
    setCommentInvalid(false);
  };

  const handleClear = () => {
    setNameQuery('');
    setNameInvalid(false);
    setEmailQuery('');
    setEmailInvalid(false);
    setCommentQuery('');
    setCommentInvalid(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const name = nameQuery.trim();
    const email = emailQuery.trim();
    const comment = commentQuery.trim();

    if (name === '') {
      setNameInvalid(true);
    }

    if (email === '') {
      setEmailInvalid(true);
    }

    if (comment === '') {
      setCommentInvalid(true);
    }

    if (!name || !email || !comment) {
      return;
    }

    setIsLoading(true);

    const newComment = {
      postId: postId,
      name: name,
      email: email,
      body: comment,
    };

    createComment({ ...newComment })
      .then(data => {
        setComments(prevComments => [...prevComments, data]);
        setCommentQuery('');
      })
      .catch(() => {
        setIsError(true);
        setCommentQuery(newComment.body);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form data-cy="NewCommentForm" onSubmit={event => handleSubmit(event)}>
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            className={cn('input', { 'is-danger': nameInvalid })}
            value={nameQuery}
            onChange={e => onNameChange(e.target.value)}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>

          {nameInvalid && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {nameInvalid && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            className={cn('input', { 'is-danger': emailInvalid })}
            value={emailQuery}
            onChange={e => onEmailChange(e.target.value)}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>

          {emailInvalid && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {emailInvalid && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>

        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={cn('textarea', { ' is-danger': commentInvalid })}
            value={commentQuery}
            onChange={e => onCommentChange(e.target.value)}
          />
        </div>

        {commentInvalid && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Enter some text
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={cn('button is-link', { 'is-loading': isLoading })}
          >
            Add
          </button>
        </div>

        <div className="control">
          {/* eslint-disable-next-line react/button-has-type */}
          <button
            type="reset"
            className="button is-link is-light"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
