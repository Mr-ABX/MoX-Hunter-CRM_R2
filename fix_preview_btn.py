with open('src/components/files-panel.tsx', 'r') as f:
    code = f.read()

old_block = """                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </>"""

new_block = """                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 border-t border-zinc-800/50 pt-4">
                            <a 
                              href={`/preview/${asset.id}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-sm font-medium transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" /> View Preview
                            </a>
                          </div>
                        </div>
                      </>"""

if old_block in code:
    code = code.replace(old_block, new_block)
    with open('src/components/files-panel.tsx', 'w') as f:
        f.write(code)
    print("Fixed preview button")
else:
    print("Could not find block to replace")

