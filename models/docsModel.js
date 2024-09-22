module.exports = (sequelize, DataTypes) => {
    const docs = sequelize.define(
      "docs",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        content: {
          type: DataTypes.TEXT, // Could store document content, markdown, or HTML.
          allowNull: true,
        },
        file_url: {
          type: DataTypes.STRING, // Store a URL to the document file.
          allowNull: true,
        },
        file_type: {
          type: DataTypes.STRING, // Specify file type (e.g., PDF, DOCX).
          allowNull: true,
        },
        version: {
          type: DataTypes.STRING, // Optional versioning of the document.
          allowNull: true,
        },
        author: {
          type: DataTypes.STRING, // Store the author or uploader's name.
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM("draft", "published", "archived"), // Document status.
          defaultValue: "draft",
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          allowNull: true,
          type: DataTypes.DATE,
        },
      },
      { timestamps: true } // Use Sequelize's automatic timestamps.
    );
  
    return docs;
  };
  