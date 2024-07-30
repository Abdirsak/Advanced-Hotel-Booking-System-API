import Menu from "./model.js"; // Adjust the path as necessary

// Bulk Create or Update Menu items
export const createOrUpdateMenus = async (req, res) => {
  try {
    const menusData = req.body;

    const processMenu = async (menuData) => {
      const { _id, title, children, ...data } = menuData;

      let menuDoc;
      if (_id) {
        menuDoc = await Menu.findOneAndUpdate({ _id }, data, {
          new: true,
          upsert: true,
        });
      } else {
        menuDoc = await Menu.findOneAndUpdate({ title }, data, {
          new: true,
          upsert: true,
        });
        if (!menuDoc) {
          menuDoc = new Menu({ title, ...data });
          await menuDoc.save();
        }
      }

      if (children && children.length > 0) {
        const childOps = await Promise.all(
          children.map(async (child) => {
            const childDoc = await processMenu(child);
            return childDoc._id;
          })
        );

        menuDoc.children = childOps;
        await menuDoc.save();
      }

      return menuDoc;
    };

    // Prepare bulk operations for menus
    const bulkOps = menusData.map((menu) => processMenu(menu));

    // Execute all operations
    const results = await Promise.all(bulkOps);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error processing menus", error });
  }
};

// Get all Menu items
export const getAllMenus = async (req, res) => {
  try {
    // Fetch all menus
    const allMenus = await Menu.find().lean();

    // Organize menus by their ID for easy access
    const menusById = {};
    allMenus.forEach((menu) => {
      menusById[menu._id.toString()] = menu;
    });

    // Initialize an array for top-level menus
    const topLevelMenus = [];

    // Track menus that have been displayed as children
    const displayedChildren = new Set();

    // Add children to their respective parent menus
    allMenus.forEach((menu) => {
      if (menu.children && menu.children.length > 0) {
        menu.children = menu.children.map((childId) => {
          displayedChildren.add(childId.toString());
          return menusById[childId.toString()];
        });
      }

      // If the menu is not a child of any other menu, it's a top-level menu
      if (!displayedChildren.has(menu._id.toString())) {
        topLevelMenus.push(menu);
      }
    });

    res.status(200).json(topLevelMenus);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menus", error });
  }
};
