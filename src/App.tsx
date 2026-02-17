import classNames from 'classnames';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import React, { useEffect, useState } from 'react';
import { PostsList } from './components/PostsList';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { PostDetails } from './components/PostDetails';
import { getUserPosts, getUsers } from './api/api';
import { User } from './types/User';
import { Post } from './types/Post';

export const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormButtonVisible, setIsFormButtonVisible] = useState(true);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleSelectOpen = () => {
    setIsActive(!isActive);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setIsActive(false);
    setIsOpen(false);
    setSelectedPost(null);

    setIsLoading(true);

    if (user) {
      getUserPosts(user.id)
        .then(postsFromServer => {
          setPosts(postsFromServer);
          setIsError(false);
        })
        .catch(() => {
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleClick = (post: Post) => {
    setIsOpen(true);
    setSelectedPost(post);
    setIsFormOpen(false);
    setIsFormButtonVisible(true);
  };

  const handleClose = () => {
    setIsOpen(false);

    setSelectedPost(null);
  };

  const handleOpenForm = () => {
    setIsFormOpen(true);
    setIsFormButtonVisible(false);
  };

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  users={users}
                  isOpen={isActive}
                  selectedUser={selectedUser}
                  onClick={handleSelectOpen}
                  onSelect={handleUserSelect}
                  setIsOpen={setIsActive}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {!selectedUser && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}

                {isLoading && <Loader />}

                {!isLoading && isError && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {!isLoading && !isError && selectedUser && (
                  <>
                    {posts.length === 0 && (
                      <div
                        className="notification is-warning"
                        data-cy="NoPostsYet"
                      >
                        No posts yet
                      </div>
                    )}

                    {posts.length > 0 && (
                      <PostsList
                        posts={posts}
                        selectedPost={selectedPost}
                        onClick={handleClick}
                        onClose={handleClose}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              { 'Sidebar--open': isOpen },
            )}
          >
            {selectedPost && (
              <div className="tile is-child box is-success ">
                <PostDetails
                  post={selectedPost}
                  isFormOpen={isFormOpen}
                  isButtonVisible={isFormButtonVisible}
                  setIsFormOpen={setIsFormOpen}
                  onClick={handleOpenForm}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
