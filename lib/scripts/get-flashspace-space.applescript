tell application "System Events" �
  to tell process "FlashSpace" �
    to set workspace to (title of menu bar items of menu bar 2)
return workspace
