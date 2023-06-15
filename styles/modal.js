const Modal = () => {
  return (
    <div className="wrap">
      <div className="DocSearch-Modal" style={{ '-docsearchVh': '9px', minWidth: '40rem' }}>
        <header className="DocSearch-SearchBar">
          <form className="DocSearch-Form">
            <label className="DocSearch-MagnifierLabel" htmlFor="docsearch-input" id="docsearch-label">
              <svg width={20} height={20} className="DocSearch-Search-Icon" viewBox="0 0 20 20">
                <path
                  d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                  stroke="currentColor"
                  fill="none"
                  fillRule="evenodd"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
            <div className="DocSearch-LoadingIndicator">
              <svg viewBox="0 0 38 38" stroke="currentColor" strokeOpacity=".5">
                <g fill="none" fillRule="evenodd">
                  <g transform="translate(1 1)" strokeWidth={2}>
                    <circle strokeOpacity=".3" cx={18} cy={18} r={18} />
                    <path d="M36 18c0-9.94-8.06-18-18-18">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 18 18"
                        to="360 18 18"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>
                </g>
              </svg>
            </div>
            <input
              className="DocSearch-Input"
              aria-autocomplete="both"
              aria-labelledby="docsearch-label"
              id="docsearch-input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              enterkeyhint="go"
              spellCheck="false"
              placeholder="Search documentation"
              maxLength={64}
              type="search"
              defaultValue
            />
            <button
              type="reset"
              title="Clear the query"
              className="DocSearch-Reset"
              aria-label="Clear the query"
              hidden
            >
              <svg width={20} height={20} viewBox="0 0 20 20">
                <path
                  d="M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z"
                  stroke="currentColor"
                  fill="none"
                  fillRule="evenodd"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
          <button className="DocSearch-Cancel" type="reset" aria-label="Cancel">
            Cancel
          </button>
        </header>
        <div className="DocSearch-Dropdown">
          <div className="DocSearch-Dropdown-Container">
            <section className="DocSearch-Hits">
              <div className="DocSearch-Hit-source">Recent</div>
              <ul role="listbox" aria-labelledby="docsearch-label" id="docsearch-list">
                <li className="DocSearch-Hit" id="docsearch-item-0" role="option" aria-selected="false">
                  <a className href="/docs/font-size">
                    <div className="DocSearch-Hit-Container">
                      <div className="DocSearch-Hit-icon">
                        <svg width={20} height={20} viewBox="0 0 20 20">
                          <g
                            stroke="currentColor"
                            fill="none"
                            fillRule="evenodd"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3.18 6.6a8.23 8.23 0 1112.93 9.94h0a8.23 8.23 0 01-11.63 0" />
                            <path d="M6.44 7.25H2.55V3.36M10.45 6v5.6M10.45 11.6L13 13" />
                          </g>
                        </svg>
                      </div>
                      <div className="DocSearch-Hit-content-wrapper">
                        <span className="DocSearch-Hit-title">Font Size</span>
                      </div>
                      <div className="DocSearch-Hit-action">
                        <button className="DocSearch-Hit-action-button" title="Save this search" type="submit">
                          <svg width={20} height={20} viewBox="0 0 20 20">
                            <path
                              d="M10 14.2L5 17l1-5.6-4-4 5.5-.7 2.5-5 2.5 5 5.6.8-4 4 .9 5.5z"
                              stroke="currentColor"
                              fill="none"
                              fillRule="evenodd"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="DocSearch-Hit-action">
                        <button
                          className="DocSearch-Hit-action-button"
                          title="Remove this search from history"
                          type="submit"
                        >
                          <svg width={20} height={20} viewBox="0 0 20 20">
                            <path
                              d="M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z"
                              stroke="currentColor"
                              fill="none"
                              fillRule="evenodd"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </a>
                </li>
                <li className="DocSearch-Hit" id="docsearch-item-1" role="option" aria-selected="false">
                  <a className href="/docs/margin">
                    <div className="DocSearch-Hit-Container">
                      <div className="DocSearch-Hit-icon">
                        <svg width={20} height={20} viewBox="0 0 20 20">
                          <g
                            stroke="currentColor"
                            fill="none"
                            fillRule="evenodd"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3.18 6.6a8.23 8.23 0 1112.93 9.94h0a8.23 8.23 0 01-11.63 0" />
                            <path d="M6.44 7.25H2.55V3.36M10.45 6v5.6M10.45 11.6L13 13" />
                          </g>
                        </svg>
                      </div>
                      <div className="DocSearch-Hit-content-wrapper">
                        <span className="DocSearch-Hit-title">Margin</span>
                      </div>
                      <div className="DocSearch-Hit-action">
                        <button className="DocSearch-Hit-action-button" title="Save this search" type="submit">
                          <svg width={20} height={20} viewBox="0 0 20 20">
                            <path
                              d="M10 14.2L5 17l1-5.6-4-4 5.5-.7 2.5-5 2.5 5 5.6.8-4 4 .9 5.5z"
                              stroke="currentColor"
                              fill="none"
                              fillRule="evenodd"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="DocSearch-Hit-action">
                        <button
                          className="DocSearch-Hit-action-button"
                          title="Remove this search from history"
                          type="submit"
                        >
                          <svg width={20} height={20} viewBox="0 0 20 20">
                            <path
                              d="M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z"
                              stroke="currentColor"
                              fill="none"
                              fillRule="evenodd"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </a>
                </li>
                <li className="DocSearch-Hit" id="docsearch-item-2" role="option" aria-selected="false">
                  <a className href="/docs/border-radius">
                    <div className="DocSearch-Hit-Container">
                      <div className="DocSearch-Hit-icon">
                        <svg width={20} height={20} viewBox="0 0 20 20">
                          <g
                            stroke="currentColor"
                            fill="none"
                            fillRule="evenodd"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3.18 6.6a8.23 8.23 0 1112.93 9.94h0a8.23 8.23 0 01-11.63 0" />
                            <path d="M6.44 7.25H2.55V3.36M10.45 6v5.6M10.45 11.6L13 13" />
                          </g>
                        </svg>
                      </div>
                      <div className="DocSearch-Hit-content-wrapper">
                        <span className="DocSearch-Hit-title">Border Radius</span>
                      </div>
                      <div className="DocSearch-Hit-action">
                        <button className="DocSearch-Hit-action-button" title="Save this search" type="submit">
                          <svg width={20} height={20} viewBox="0 0 20 20">
                            <path
                              d="M10 14.2L5 17l1-5.6-4-4 5.5-.7 2.5-5 2.5 5 5.6.8-4 4 .9 5.5z"
                              stroke="currentColor"
                              fill="none"
                              fillRule="evenodd"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="DocSearch-Hit-action">
                        <button
                          className="DocSearch-Hit-action-button"
                          title="Remove this search from history"
                          type="submit"
                        >
                          <svg width={20} height={20} viewBox="0 0 20 20">
                            <path
                              d="M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z"
                              stroke="currentColor"
                              fill="none"
                              fillRule="evenodd"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </a>
                </li>
                <li className="DocSearch-Hit" id="docsearch-item-3" role="option" aria-selected="false">
                  <a className href="/docs/z-index">
                    <div className="DocSearch-Hit-Container">
                      <div className="DocSearch-Hit-icon">
                        <svg width={20} height={20} viewBox="0 0 20 20">
                          <g
                            stroke="currentColor"
                            fill="none"
                            fillRule="evenodd"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3.18 6.6a8.23 8.23 0 1112.93 9.94h0a8.23 8.23 0 01-11.63 0" />
                            <path d="M6.44 7.25H2.55V3.36M10.45 6v5.6M10.45 11.6L13 13" />
                          </g>
                        </svg>
                      </div>
                      <div className="DocSearch-Hit-content-wrapper">
                        <span className="DocSearch-Hit-title">Z-Index</span>
                      </div>
                      <div className="DocSearch-Hit-action">
                        <button className="DocSearch-Hit-action-button" title="Save this search" type="submit">
                          <svg width={20} height={20} viewBox="0 0 20 20">
                            <path
                              d="M10 14.2L5 17l1-5.6-4-4 5.5-.7 2.5-5 2.5 5 5.6.8-4 4 .9 5.5z"
                              stroke="currentColor"
                              fill="none"
                              fillRule="evenodd"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="DocSearch-Hit-action">
                        <button
                          className="DocSearch-Hit-action-button"
                          title="Remove this search from history"
                          type="submit"
                        >
                          <svg width={20} height={20} viewBox="0 0 20 20">
                            <path
                              d="M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z"
                              stroke="currentColor"
                              fill="none"
                              fillRule="evenodd"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </section>
            <section className="DocSearch-Hits">
              <div className="DocSearch-Hit-source">Favorite</div>
              <ul role="listbox" aria-labelledby="docsearch-label" id="docsearch-list">
                <li className="DocSearch-Hit" id="docsearch-item-4" role="option" aria-selected="false">
                  <a className href="/docs/width">
                    <div className="DocSearch-Hit-Container">
                      <div className="DocSearch-Hit-icon">
                        <svg width={20} height={20} viewBox="0 0 20 20">
                          <path
                            d="M10 14.2L5 17l1-5.6-4-4 5.5-.7 2.5-5 2.5 5 5.6.8-4 4 .9 5.5z"
                            stroke="currentColor"
                            fill="none"
                            fillRule="evenodd"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="DocSearch-Hit-content-wrapper">
                        <span className="DocSearch-Hit-title">Width</span>
                      </div>
                      <div className="DocSearch-Hit-action">
                        <button
                          className="DocSearch-Hit-action-button"
                          title="Remove this search from favorites"
                          type="submit"
                        >
                          <svg width={20} height={20} viewBox="0 0 20 20">
                            <path
                              d="M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z"
                              stroke="currentColor"
                              fill="none"
                              fillRule="evenodd"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
        <footer className="DocSearch-Footer">
          <ul className="DocSearch-Commands">
            <li>
              <kbd className="DocSearch-Commands-Key">
                <svg width={15} height={15} aria-label="Enter key" role="img">
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
                    <path d="M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3" />
                  </g>
                </svg>
              </kbd>
              <span className="DocSearch-Label">to select</span>
            </li>
            <li>
              <kbd className="DocSearch-Commands-Key">
                <svg width={15} height={15} aria-label="Arrow down" role="img">
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
                    <path d="M7.5 3.5v8M10.5 8.5l-3 3-3-3" />
                  </g>
                </svg>
              </kbd>
              <kbd className="DocSearch-Commands-Key">
                <svg width={15} height={15} aria-label="Arrow up" role="img">
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
                    <path d="M7.5 11.5v-8M10.5 6.5l-3-3-3 3" />
                  </g>
                </svg>
              </kbd>
              <span className="DocSearch-Label">to navigate</span>
            </li>
            <li>
              <kbd className="DocSearch-Commands-Key">
                <svg width={15} height={15} aria-label="Escape key" role="img">
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
                    <path d="M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956" />
                  </g>
                </svg>
              </kbd>
              <span className="DocSearch-Label">to close</span>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
};
