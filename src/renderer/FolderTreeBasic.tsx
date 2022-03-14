import FolderTree, { testData } from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';
import './FolderTreeBasic.css';

export default function FolderTreeBasic() {
  const onTreeStateChange = (state: any, event: any) => {
    console.log(state, event);
  };

  console.log('test-data...');
  console.log(testData);
  /*
    "data" looks like this...

    {name: "Root-Folder", children: [
      {name: "Foo.txt"},
      {name: "Bar-Folder", children: [{name: "Bar.txt"}]}
    ]}
  */

  return (
    <FolderTree
      className="FolderTreeBasic"
      showCheckbox={false}
      data={testData}
      onChange={onTreeStateChange}
      readOnly
    />
  );
}
