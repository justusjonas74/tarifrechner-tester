import { CopyBlock , atomOneDark} from "react-code-blocks";

interface HighlightComponentProps {
code:string,
language:string
}

export default function HighlightComponent(props:HighlightComponentProps) {
    const copyBlockProps = {
        text: props.code,
        language: props.language,
        showLineNumbers: true,
        // startingLineNumber: props.startingLineNumber,
        wrapLines: true,
        
      };

      return (
        <CopyBlock
          {...copyBlockProps}
          customStyle={{
            height: '200px',
            overflow: 'scroll',
            fontSize: '0.75rem',
          }}
          theme={atomOneDark}
        />
      );


} 
